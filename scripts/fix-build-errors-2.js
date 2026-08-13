const fs = require('fs');

const pageFile = 'src/app/(storefront)/products/[id]/page.tsx';
if (fs.existsSync(pageFile)) {
    let content = fs.readFileSync(pageFile, 'utf8');
    content = content.replace(/\(s, i\) =>/g, '(s: any, i: number) =>');
    content = content.replace(/\(item, i\) =>/g, '(item: any, i: number) =>');
    content = content.replace(/\(offer, i\) =>/g, '(offer: any, i: number) =>');
    fs.writeFileSync(pageFile, content);
}

const loginFile = 'src/app/(auth)/login/page.tsx';
if (fs.existsSync(loginFile)) {
    let content = fs.readFileSync(loginFile, 'utf8');
    content = content.replace(/await validateSession\(session, req\)/g, 'await validateSession(session)');
    fs.writeFileSync(loginFile, content);
}

const authAdapterFile = 'src/modules/auth/frontend-contracts/SupabaseAuthAdapter.ts';
if (fs.existsSync(authAdapterFile)) {
    let content = fs.readFileSync(authAdapterFile, 'utf8');
    content = content.replace(/code: 'UNSUPPORTED',/g, 'code: "UNAUTHORIZED",');
    fs.writeFileSync(authAdapterFile, content);
}

console.log('Fixed more errors');
