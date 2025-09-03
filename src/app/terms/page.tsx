'use client'

export default function TermsPage() {
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
            Terms of Service
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
            Welcome to ChristTask. These Terms of Service ("Terms") govern your use of our Christian apologetics platform and AI-powered chatbot service.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            By accessing or using ChristTask, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.
          </p>
        </section>

        {/* Service Description */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Service Description
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            ChristTask provides an AI-powered Christian apologetics assistant that helps users:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Answer objections to Christianity with Scripture-based responses</li>
            <li>Provide biblical references and theological explanations</li>
            <li>Offer guidance on defending the Christian faith</li>
            <li>Support Christian study and apologetics training</li>
          </ul>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            Our service is designed as a study aid and conversation partner for Christian apologetics.
          </p>
        </section>

        {/* User Accounts */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            User Accounts and Subscriptions
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            To access ChristTask's full features, you must create an account and subscribe to one of our plans:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Account Creation:</strong> You must provide accurate, complete information</li>
            <li><strong>Subscription Plans:</strong> Weekly (£4.50) or Monthly (£11.99) billing</li>
            <li><strong>Payment Processing:</strong> Handled securely through Whop</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining account security</li>
          </ul>
        </section>

        {/* Acceptable Use */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Acceptable Use
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            You agree to use ChristTask only for lawful purposes and in accordance with these Terms:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Use the service for Christian study and apologetics purposes</li>
            <li>Respect the faith-based nature of the platform</li>
            <li>Maintain respectful and constructive dialogue</li>
            <li>Not attempt to manipulate or abuse the AI system</li>
            <li>Not use the service for commercial purposes without permission</li>
          </ul>
          
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Prohibited Uses
          </h3>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Harassment, hate speech, or discriminatory content</li>
            <li>Attempting to bypass security measures</li>
            <li>Sharing account credentials with others</li>
            <li>Using the service for illegal activities</li>
            <li>Attempting to reverse engineer our AI systems</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Intellectual Property
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            <strong>Our Rights:</strong> ChristTask and its content are owned by us and protected by intellectual property laws.
          </p>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            <strong>Your Rights:</strong> You retain ownership of content you create, but grant us license to use it for service improvement.
          </p>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            <strong>Scripture References:</strong> Biblical text references are provided for educational purposes. Scripture itself is in the public domain.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            <strong>AI Responses:</strong> AI-generated responses are provided for educational use but should be verified against Scripture.
          </p>
        </section>

        {/* Disclaimers */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Disclaimers and Limitations
          </h2>
          
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Educational Use Only
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            ChristTask is designed as an educational tool and study aid. AI responses should be:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Verified against Scripture and reliable sources</li>
            <li>Used as a starting point for further study</li>
            <li>Not considered infallible theological advice</li>
            <li>Supplemented with prayer and spiritual guidance</li>
          </ul>

          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Service Availability
          </h3>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We strive to maintain service availability but cannot guarantee:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Uninterrupted service availability</li>
            <li>Immediate response times</li>
            <li>Complete accuracy of all AI responses</li>
            <li>Compatibility with all devices or browsers</li>
          </ul>

          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            margin: '0 0 12px',
            color: 'var(--text)'
          }}>
            Limitation of Liability
          </h3>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            ChristTask is provided "as is" without warranties. We are not liable for any damages arising from use of our service, including but not limited to theological disagreements, spiritual decisions, or reliance on AI responses.
          </p>
        </section>

        {/* Subscription Terms */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Subscription and Billing
          </h2>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Billing Cycle:</strong> Weekly or monthly, as selected</li>
            <li><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled</li>
            <li><strong>Cancellation:</strong> You may cancel anytime through your account settings</li>
            <li><strong>Refunds:</strong> No refunds for partial periods; full refunds for technical issues</li>
            <li><strong>Price Changes:</strong> We may adjust prices with 30 days notice</li>
          </ul>
        </section>

        {/* Termination */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Termination
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our service.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            Upon termination, your right to use ChristTask will cease immediately, and we may delete your account data in accordance with our Privacy Policy.
          </p>
        </section>

        {/* Privacy */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Privacy
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of ChristTask, to understand our practices.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            By using our service, you consent to the collection and use of information as detailed in our Privacy Policy.
          </p>
        </section>

        {/* Governing Law */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Governing Law
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            Any disputes arising from these Terms or your use of ChristTask will be resolved through binding arbitration or in the courts of [Your Jurisdiction].
          </p>
        </section>

        {/* Changes to Terms */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: '0 0 16px',
            color: 'var(--text)'
          }}>
            Changes to Terms
          </h2>
          <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
            We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
          </p>
          <ul style={{ 
            margin: '0 0 20px', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li>Posting updated Terms on our website</li>
            <li>Sending email notifications to active users</li>
            <li>Updating the "Last updated" date</li>
          </ul>
          <p style={{ margin: '0', color: 'var(--muted)' }}>
            Your continued use of ChristTask after changes constitutes acceptance of the updated Terms.
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
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul style={{ 
            margin: '0', 
            paddingLeft: '20px',
            color: 'var(--muted)'
          }}>
            <li><strong>Email:</strong> legal@christtask.com</li>
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
