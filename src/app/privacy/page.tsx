'use client'

export default function PrivacyPolicyPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg)', 
      color: 'var(--text)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            margin: '0 0 16px',
            color: 'var(--brand)'
          }}>
            Privacy Policy
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--muted)',
            margin: '0'
          }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Introduction
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            ChristTask ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Christian apologetics platform.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            By using ChristTask, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Information We Collect
          </h2>
          
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Personal Information
          </h3>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Email address and account information</li>
            <li>Payment information (processed securely through Whop)</li>
            <li>Name and profile details</li>
            <li>Communication preferences</li>
          </ul>

          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Usage Information
          </h3>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Chat conversations and questions asked</li>
            <li>Scripture references and study patterns</li>
            <li>Feature usage and interaction data</li>
            <li>Device information and browser type</li>
          </ul>

          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Religious Content
          </h3>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            We may collect faith-related information you share during conversations, which we treat with special care and respect for your spiritual privacy.
          </p>
        </section>

        {/* How We Use Information */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            How We Use Your Information
          </h2>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Provide personalized apologetics assistance and Scripture references</li>
            <li>Process payments and manage your subscription</li>
            <li>Improve our service and develop new features</li>
            <li>Send important updates and faith-related content (with your consent)</li>
            <li>Ensure platform security and prevent abuse</li>
            <li>Provide customer support and respond to inquiries</li>
          </ul>
        </section>

        {/* Information Sharing */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Information Sharing
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Service Providers:</strong> With trusted partners who help us operate our platform (payment processing, hosting, analytics)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Consent:</strong> With your explicit permission for specific purposes</li>
          </ul>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            <strong>We never share your faith-related conversations or personal spiritual information without your explicit consent.</strong>
          </p>
        </section>

        {/* Data Security */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Data Security
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We implement appropriate security measures to protect your information:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Encryption of data in transit and at rest</li>
            <li>Secure authentication and access controls</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal information on a need-to-know basis</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Your Rights
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            You have the right to:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Export your data in a portable format</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Restriction:</strong> Limit how we process your information</li>
          </ul>
        </section>

        {/* Cookies */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Cookies and Tracking
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We use cookies and similar technologies to:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Remember your login status and preferences</li>
            <li>Analyze platform usage and improve performance</li>
            <li>Provide personalized content and recommendations</li>
            <li>Ensure platform security</li>
          </ul>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        {/* Children's Privacy */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Children's Privacy
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            ChristTask is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </section>

        {/* International Users */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            International Users
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            If you are accessing ChristTask from outside the United States, please note that your information may be transferred to, stored, and processed in the United States where our servers are located.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            We comply with applicable data protection laws, including GDPR for European users.
          </p>
        </section>

        {/* Changes to Policy */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Changes to This Policy
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            Your continued use of ChristTask after any changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact Information */}
        <section style={{ 
          marginBottom: '40px',
          padding: '24px',
          background: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Contact Us
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Email:</strong> privacy@christtask.com</li>
            <li><strong>Address:</strong> [Your Business Address]</li>
            <li><strong>Phone:</strong> [Your Phone Number]</li>
          </ul>
        </section>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a 
            href="/" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--brand)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = 'var(--brand-strong)';
              (e.target as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = 'var(--brand)';
              (e.target as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Back to Home
          </a>
        </div>

      </div>
    </div>
  )
}
