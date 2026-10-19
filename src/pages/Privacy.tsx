import { Card, ExternalLink, PageHeader } from '../components/ui';

export default function Privacy() {
  const section = 'space-y-2 text-sm leading-relaxed';
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="Plain-language explanation of what SurSadhana stores and sends. Last updated October 2026." />
      <div className="space-y-4">
        <Card>
          <h2 className="font-semibold">In short</h2>
          <ul className={`${section} mt-2 list-disc pl-5`}>
            <li>No ads, no tracking cookies, no analytics profiles.</li>
            <li>Your microphone audio is analysed live inside your browser and is never uploaded.</li>
            <li>Your progress is stored in your browser unless you choose to create an account for sync.</li>
            <li>You can export or delete your data at any time from Settings.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold">Data stored on your device</h2>
          <div className={section}>
            <p><strong>Learning data</strong> (profile answers, lesson progress, quiz scores, measured pitch/rhythm/listening results, practice sessions, songs, saved videos, tutor chat and memory notes) is saved in your browser&apos;s localStorage.</p>
            <p><strong>Recordings</strong> are saved only after you give consent, only in this browser (IndexedDB). They are never uploaded, synced or sent to the AI tutor. Delete them individually in the Recording Journal or all at once in Settings.</p>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Data sent to the SurSadhana server</h2>
          <div className={section}>
            <p><strong>Account sync (optional).</strong> If you create an account, your email address, a securely hashed password (scrypt — the password itself is never stored) and a copy of your learning data (not recordings) are stored on this server so you can use SurSadhana on other devices. Deleting your account permanently deletes this copy.</p>
            <p><strong>Error reports.</strong> If the app crashes, a short technical report (error message, page path, browser type) may be sent so problems can be fixed. It contains no lesson data, recordings or account details. You can turn this off in Settings.</p>
            <p><strong>Song search.</strong> Song titles you search for are passed to Apple&apos;s iTunes Search API to find song credits.</p>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Third-party services (only when the site owner has enabled them)</h2>
          <div className={section}>
            <p><strong>AI Vocal Tutor (Anthropic Claude or Google Gemini).</strong> When you send a message, your question, recent chat messages and a compact summary of your learning (level, lesson titles, measured scores, practice statistics, saved memory notes) are sent via this server to whichever AI provider the site owner has configured, to generate a reply. No audio is sent. See <ExternalLink href="https://www.anthropic.com/legal/privacy">Anthropic&apos;s privacy policy</ExternalLink> and the <ExternalLink href="https://ai.google.dev/gemini-api/terms">Gemini API terms</ExternalLink>.</p>
            <p><strong>YouTube.</strong> The Video Library uses YouTube API Services to search videos and may embed YouTube players. By using these features you agree to the <ExternalLink href="https://www.youtube.com/t/terms">YouTube Terms of Service</ExternalLink>; Google&apos;s handling of data is described in the <ExternalLink href="https://policies.google.com/privacy">Google Privacy Policy</ExternalLink>. Embedded players use the privacy-enhanced youtube-nocookie.com domain. You can revoke API access via <ExternalLink href="https://security.google.com/settings/security/permissions">Google security settings</ExternalLink> (SurSadhana does not access your Google account).</p>
            <p><strong>Fonts.</strong> Fonts are loaded from Google Fonts, which receives your IP address when fetching them.</p>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Your choices</h2>
          <ul className={`${section} mt-2 list-disc pl-5`}>
            <li>Export, import or reset all learning data — Settings → Your data.</li>
            <li>Delete recordings or withdraw recording consent — Settings.</li>
            <li>Delete your sync account and its server copy — Settings → Account &amp; sync.</li>
            <li>Turn off error reports — Settings.</li>
          </ul>
          <p className="mt-3 text-xs text-muted">SurSadhana is an educational tool and does not give medical advice. If you have persistent voice problems, please see a doctor or ENT specialist.</p>
        </Card>
      </div>
    </>
  );
}
