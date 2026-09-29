# CV Builder V2 — Monetization and Career Ecosystem Architecture

## Purpose
This document defines commercial and future ecosystem requirements that must be considered while designing CV Builder V2.

## 1. Commercial model
Support a layered model: free/local-first CV Builder, advertising-supported usage where appropriate, premium templates/profile designs, premium feature entitlements, optional subscription or package access, future Student Career Wallet ecosystem and future career/application products.
The exact prices, payment provider and commercial packaging are not fixed here.

## 2. Advertising layer
Reserve an Advertising/Monetization Layer capable of supporting Google Ads/AdSense or another approved advertising provider.
Requirements:
- ads remain outside generated CV documents;
- desktop/mobile placements can differ;
- ad placement must not destroy editing usability;
- premium/ad-free users can have advertising disabled by entitlement;
- advertising configuration must not be hard-coded into the document renderer;
- privacy/consent requirements must be respected;
- sensitive CV content must not be sent to advertisers as ordinary ad behavior;
- ad reporting remains separate from CV content.

Possible inventory: builder shell, template discovery, tool landing pages, ATS checker landing/results areas where appropriate, and career-content pages.
Ad placement inside active editing controls should be conservative and validated for UX.

## 3. Premium product catalog
Potential products: premium CV templates, premium template collections, premium profile designs, premium cover-letter designs, premium online CV themes, advanced analysis packages, AI usage packages and career-document bundles.

## 4. Entitlement model
Commercial access should use an entitlement layer.
Concept: User → entitlement → capability/product access.
Examples: premium-template-pack, advanced-ats-analysis, ai-writing-access, ad-free, premium-online-profile.
The feature itself must not contain payment logic.

## 5. Purchase lifecycle
Support catalog availability, purchase initiation, successful purchase, entitlement activation, cancellation, refund, revocation, expiry where applicable, promotional grants and administrative grants.
Payment-provider selection is intentionally deferred.

## 6. Premium profile/template sales
A premium profile may be sold as a professionally designed CV/profile experience.
Support preview before purchase, clear feature description, versioned package, supported sections, export support, compatibility information, price/currency, purchase state, activation and future updates.
Existing user CV data must remain safe if a purchased template is updated or deprecated.

## 7. Subscription vs one-time purchase
The architecture should support one-time purchases, subscriptions and credits/packages such as AI or advanced analysis credits.

## 8. Free/premium boundary
The free experience should remain genuinely useful.
Potential premium boundaries include advanced templates, advanced customization, advanced ATS analysis, advanced job matching, AI limits, online profile customization, larger storage/version limits and ad-free mode.
The exact free/premium matrix is a separate product decision.

## 9. Student-friendly commercial design
Free creation should remain accessible. Premium value should be transparent. Users should understand what they receive before purchase. Free users must not lose existing data because they do not pay.

## 10. Student Career Wallet
The Student Career Wallet should become a reusable career-data layer for the broader eStudent ecosystem.
Potential data domains: profile, education, skills, certifications, projects, experience, achievements, CVs, cover letters, portfolio, applications and career documents.
The wallet should allow future products to reuse authorized career data instead of repeatedly collecting the same information.

## 11. Future integrations
Potential connections include CV Builder, ATS Checker, Job Matcher, Cover Letter Builder, Online CV, Job Application Tracker, Interview Coach, education/student tools, certificates/credentials, external job services and cloud backup.
Each integration requires a documented contract and explicit user authorization.

## 12. Career-data ownership
Distinguish source career data, generated documents, derived analysis, AI-generated suggestions, purchased design assets and application records.
This prevents one feature from becoming the accidental owner of all student data.

## 13. Monetization privacy
Document what purchase data is stored, what analytics are collected, what advertising systems receive, what AI providers receive, retention, export/delete behavior and entitlement history.

## 14. Architecture rule
Keep these concerns separate:

Document Core → creates CVs
Career Data → stores/reuses profile information
Intelligence → analyzes and assists
Presentation → templates/themes
Monetization → products/entitlements/advertising
Platform → accounts/cloud/integrations

This separation allows the product to evolve for many years without repeatedly rewriting the CV core.