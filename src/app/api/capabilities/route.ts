import { NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/features';
import { CAPABILITIES } from '@/features/registry/capabilities';
import { db } from '@/db';
import { featureFlags, featureFlagAudit } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const capabilitiesMap: Record<string, 'ACTIVE' | 'EMERGENCY_KILLED' | 'DISABLED'> = {};
  
  // To avoid hundreds of DB calls, we could fetch all flags at once.
  // But for the MVP with a small number of features, we can just call isFeatureEnabled for all keys,
  // or optimize it here. Let's optimize it.
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isDev = user?.email === 'neethk2003@gmail.com';

    const flags = await db.select().from(featureFlags);
    const dbFlagMap = new Map(flags.map(f => [f.featureKey, f]));

    for (const cap of CAPABILITIES) {
      const dbFlag = dbFlagMap.get(cap.key);
      
      // Check emergency kill first
      if (dbFlag && !dbFlag.enabled && dbFlag.reason === 'EMERGENCY_KILL') {
        capabilitiesMap[cap.key] = 'EMERGENCY_KILLED';
        continue;
      }
      
      // Then dev preview
      let enabled = false;
      if (isDev) {
         enabled = true; // Developer sees all features if not emergency killed
      } else if (dbFlag) {
         enabled = dbFlag.enabled;
      } else {
         // Default to enabled if it's an MVP feature
         const MVP_FEATURES = [
             'auth.login', 'auth.signup', 'auth.session',
             'catalog.products', 'catalog.categories', 'catalog.search', 'catalog.specifications',
             'commerce.cart', 'commerce.checkout', 'commerce.orders',
             'ops.control_center', 'ops.catalog'
         ];
         enabled = MVP_FEATURES.includes(cap.key);
      }
      
      capabilitiesMap[cap.key] = enabled ? 'ACTIVE' : 'DISABLED';
    }

    return NextResponse.json(capabilitiesMap);
  } catch (error) {
    console.error('[Capabilities API] Error — returning MVP defaults', error);
    // Return hardcoded MVP defaults so the storefront never breaks on a failed capabilities fetch
    const mvpDefaults: Record<string, 'ACTIVE' | 'EMERGENCY_KILLED' | 'DISABLED'> = {
      'auth.login': 'ACTIVE',
      'auth.signup': 'ACTIVE',
      'auth.session': 'ACTIVE',
      'catalog.products': 'ACTIVE',
      'catalog.categories': 'ACTIVE',
      'catalog.search': 'ACTIVE',
      'catalog.specifications': 'ACTIVE',
      'commerce.cart': 'ACTIVE',
      'commerce.checkout': 'ACTIVE',
      'commerce.orders': 'ACTIVE',
      'ops.control_center': 'ACTIVE',
      'ops.catalog': 'ACTIVE',
    };
    return NextResponse.json(mvpDefaults);
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Only developer can toggle features in this simplistic MVP
    if (user?.email !== 'neethk2003@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { featureKey } = await req.json();
    
    const existingFlag = await db.select().from(featureFlags).where(eq(featureFlags.featureKey, featureKey)).limit(1);
    
    let newState = true;
    let newReason = '';
    
    if (existingFlag.length > 0) {
       // Toggle logic: If it was active, emergency kill it. If it was killed, activate it.
       const flag = existingFlag[0];
       if (flag.enabled || (!flag.enabled && flag.reason !== 'EMERGENCY_KILL')) {
          newState = false;
          newReason = 'EMERGENCY_KILL';
       } else {
          newState = true;
          newReason = 'MANUAL_OVERRIDE';
       }
       
       await db.update(featureFlags)
         .set({ enabled: newState, reason: newReason, updatedBy: user.id, updatedAt: new Date() })
         .where(eq(featureFlags.featureKey, featureKey));
         
       // Audit log
       await db.insert(featureFlagAudit).values({
         featureKey,
         oldState: flag.enabled,
         newState,
         reason: newReason,
         changedBy: user.id,
         environment: 'production'
       });
    } else {
       // Create it as killed
       newState = false;
       newReason = 'EMERGENCY_KILL';
       await db.insert(featureFlags).values({
         featureKey,
         enabled: false,
         reason: newReason,
         updatedBy: user.id,
         environment: 'production'
       });
       
       await db.insert(featureFlagAudit).values({
         featureKey,
         oldState: true,
         newState,
         reason: newReason,
         changedBy: user.id,
         environment: 'production'
       });
    }

    // Return the updated capabilities map (trigger GET logic)
    // We could do a redirect or just re-run the GET logic, but since it's an API, 
    // let's just let the client refresh or we can return the exact new state.
    // Easiest is to just call GET() directly.
    return await GET();
    
  } catch (error) {
    console.error('[Capabilities Toggle API] Error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
