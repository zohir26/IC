// app/signin/layout.js

// This file defines the metadata for the /signin route segment.
export const metadata = {
  title: 'Login | IC', // This will combine with the root layout's template to become "Login | IC"
  description: 'Log in to your IC account.',
};

export default function SignInLayout({ children }) {
  // This layout is a simple wrapper for the children (your SignInPage)
  // You can add any shared UI for the sign-in route here if needed.
  return (
    <>
      {children}
    </>
  );
}