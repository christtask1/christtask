export default function PaymentPage() {
  return (
    <div>
      <h2>Weekly Plan - $5.99/week</h2>
      <div
        data-whop-checkout-plan-id="plan_HIG7gbQzmdeoM"
        data-whop-checkout-theme="light"
        data-whop-checkout-hide-price="false"
        style={{ height: 'fit-content', overflow: 'hidden', maxWidth: '80%' }}
      ></div>

      <h2>Monthly Plan - $15.99/month</h2>
      <div
        data-whop-checkout-plan-id="plan_PGmwQ4Vkc6dxX"
        data-whop-checkout-theme="light"
        data-whop-checkout-hide-price="false"
        style={{ height: 'fit-content', overflow: 'hidden', maxWidth: '80%' }}
      ></div>
    </div>
  )
}
