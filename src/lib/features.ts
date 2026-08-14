import { db } from "@/db";
import { featureFlags } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from '@/utils/supabase/server';

export const DEVELOPER_EMAIL = "neethk2003@gmail.com";

// Central Feature Registry
export const MVP_FEATURES = [
    'auth.login', 'auth.signup', 'auth.session',
    'catalog.products', 'catalog.categories', 'catalog.search',
    'catalog.specifications',
    'commerce.cart', 'commerce.checkout', 'commerce.orders',
    'ops.control_center', 'ops.catalog'
];

export const PREVIEWABLE_FEATURES = [
    'procurement.bom', 'procurement.rfq',
    'engineering.compatibility', 'engineering.compare',
    'seller.dashboard', 'seller.catalog', 'seller.offers',
    'seller.inventory', 'seller.orders',
    'organization.dashboard', 'organization.procurement',
    'ops.finance', 'ops.audit'
];

export async function isDeveloperPreviewUser(): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user?.email === DEVELOPER_EMAIL;
    } catch {
        return false;
    }
}

export async function isFeatureEnabled(featureKey: string, environment: string = 'production'): Promise<boolean> {
    try {
        const result = await db
            .select({ enabled: featureFlags.enabled, reason: featureFlags.reason })
            .from(featureFlags)
            .where(
                and(
                    eq(featureFlags.featureKey, featureKey),
                    eq(featureFlags.environment, environment)
                )
            )
            .limit(1);

        // 1. SECURITY DENY: If we somehow fail database resolution completely for a critical check.
        // Handled by catch block below failing closed.

        const dbFlag = result[0];
        
        // 2. SYSTEM / EMERGENCY KILL SWITCH
        // We use reason === 'EMERGENCY_KILL' along with enabled === false to represent a hard kill.
        if (dbFlag && !dbFlag.enabled && dbFlag.reason === 'EMERGENCY_KILL') {
            return false;
        }

        // 3. DEVELOPER PREVIEW
        const isPreviewable = PREVIEWABLE_FEATURES.includes(featureKey) || MVP_FEATURES.includes(featureKey);
        if (isPreviewable) {
            const isDev = await isDeveloperPreviewUser();
            if (isDev) return true;
        }

        // 4. NORMAL FEATURE FLAG
        if (dbFlag) {
            return dbFlag.enabled;
        }

        // 5. NORMAL USER (Fallback)
        // If flag isn't in DB, fallback to MVP_FEATURES array for safety (or just false)
        return MVP_FEATURES.includes(featureKey);

    } catch (error) {
        console.error(`[FeatureFlag] Error checking flag ${featureKey}:`, error);
        // DB error -> Fail CLOSED
        return false;
    }
}
