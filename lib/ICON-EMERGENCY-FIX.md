# 🚨 ICON EMERGENCY FIX - Do This NOW

## Icons Still Showing as Share Icons?

Follow these 3 steps EXACTLY:

---

## ⚡ Step 1: Fix Database (2 minutes)

Open **Supabase SQL Editor**: https://supabase.com/dashboard

Copy and run this **ENTIRE** script:

```sql
-- Check what you have now
SELECT platform, icon_name, url FROM public.social_links ORDER BY order_index;

-- FIX IT
UPDATE public.social_links SET icon_name = 'Github' WHERE LOWER(url) LIKE '%github%';
UPDATE public.social_links SET icon_name = 'Linkedin' WHERE LOWER(url) LIKE '%linkedin%';
UPDATE public.social_links SET icon_name = 'Mail' WHERE LOWER(url) LIKE '%mailto%' OR url LIKE '%@%';
UPDATE public.social_links SET icon_name = 'Instagram' WHERE LOWER(url) LIKE '%instagram%';
UPDATE public.social_links SET icon_name = 'Twitter' WHERE LOWER(url) LIKE '%twitter%';
UPDATE public.social_links SET icon_name = 'Facebook' WHERE LOWER(url) LIKE '%facebook%';

-- Verify fix worked
SELECT platform, icon_name, url FROM public.social_links ORDER BY order_index;
```

**Check the last SELECT output**:
- ✅ icon_name should be: `Github`, `Linkedin`, `Mail`, `Instagram` (PascalCase)
- ❌ NOT: `github`, `linkedin`, `mail`, `share2` (lowercase)

---

## ⚡ Step 2: Clear Cache (1 minute)

```powershell
cd d:\programing_langauges\html\prasidgautam_potfolio
Remove-Item -Recurse -Force .next
npm run dev
```

---

## ⚡ Step 3: Hard Refresh Browser (10 seconds)

1. Open: http://localhost:3000
2. Press: **Ctrl + Shift + R** (clears cache)
3. Look at social icons

**Should now show**:
- ✅ GitHub icon (cat logo)
- ✅ LinkedIn icon (in logo)
- ✅ Mail icon (envelope)
- ✅ Instagram icon (camera)

---

## ❌ Still Not Working?

### Check: Did Step 1 Actually Update?

Run this:
```sql
-- This should return NO ROWS if fix worked
SELECT * FROM social_links 
WHERE icon_name NOT IN ('Github', 'Linkedin', 'Mail', 'Instagram', 'Twitter', 'Facebook', 'Youtube', 'MessageCircle', 'Globe', 'Link');
```

**If it returns rows** → Those icon names are still wrong. Fix manually:

```sql
-- Get the IDs
SELECT id, platform, icon_name FROM social_links;

-- Update each wrong one (replace ID)
UPDATE social_links SET icon_name = 'Github' WHERE id = 'put-id-here';
```

### Check: Is Server Running?

```powershell
# Should see: "Ready in X.Xs"
# Not: Errors or "Module not found"
```

### Check: Browser Console

1. Press **F12**
2. Click **Console** tab
3. Look for red errors

**Common issues**:
- "Cannot find module" → Run `npm install`
- Component errors → Check syntax in dynamic-icon.tsx
- Nothing → Database still has wrong values

---

## 🔍 Debug: What's in Database RIGHT NOW?

```sql
SELECT 
    id,
    platform,
    icon_name,
    CASE 
        WHEN icon_name ~ '^[A-Z][a-z]+$' THEN '✅ OK'
        ELSE '❌ WRONG: ' || icon_name
    END as status
FROM social_links 
ORDER BY order_index;
```

All should show "✅ OK"

---

## 🆘 Last Resort: Manual Entry

If SQL isn't working, enter data via Supabase Dashboard:

1. Go to: https://supabase.com/dashboard
2. Click: **Table Editor** → `social_links`
3. For EACH row, click **Edit**:
   - Find `icon_name` field
   - Change to exact PascalCase:
     - For GitHub URL → `Github`
     - For LinkedIn URL → `Linkedin`
     - For mailto URL → `Mail`
     - For Instagram URL → `Instagram`
4. Click **Save**
5. Repeat for ALL rows

Then do Step 2 and 3 above.

---

## ✅ Success Looks Like

### Database Query:
```
platform   | icon_name
-----------|----------
GitHub     | Github     ← PascalCase!
LinkedIn   | Linkedin   ← PascalCase!
Email      | Mail       ← PascalCase!
```

### Homepage:
```
[GitHub cat logo]    GitHub
[LinkedIn in logo]   LinkedIn
[Envelope icon]      Email
[Instagram camera]   INSTAGRAM
```

NOT all showing [share icon]!

---

## 📞 If This STILL Doesn't Work

The issue is likely:
1. **Database didn't update** → Check Step 1 output
2. **Cache not cleared** → Delete .next, restart server
3. **Browser cache** → Hard refresh (Ctrl+Shift+R)
4. **Wrong Lucide version** → Run `npm install lucide-react@latest`

**Tell me which step fails** and I'll help debug further!

---

*Created: October 9, 2026*  
*For: Icon display issue - share icons instead of social icons*
