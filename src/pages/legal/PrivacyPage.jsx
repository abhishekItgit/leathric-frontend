export function PrivacyPage() {
  return (
    <section className="panel mx-auto max-w-4xl space-y-6 p-8 md:p-10">
      <h1 className="text-3xl font-bold text-leather-accent">Privacy Policy</h1>
      <p className="text-stone-200">
        We collect only necessary customer details to process orders, improve shopping experience, and provide support.
      </p>
      <ul className="list-disc space-y-3 pl-6 text-stone-200">
        <li>Your data is encrypted and never sold to third parties.</li>
        <li>Payment information is processed securely through trusted gateways.</li>
        <li>You can request account data deletion by contacting our support team.</li>
      </ul>
    </section>
  );
}
