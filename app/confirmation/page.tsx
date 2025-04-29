// app/confirmation/page.tsx
export default function ConfirmationPage({
	searchParams: { checkout_id },
  }: {
	searchParams: {
	  checkout_id: string;
	};
  }) {
	return (
	  <div>
		<h1>Thank you! Your checkout is now being processed.</h1>
		<p>Checkout ID: {checkout_id}</p>
	  </div>
	);
  }