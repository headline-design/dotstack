
const TermsView = () => {
    return (
      <div >
        <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-4 text-center md:py-24 lg:space-y-8">
          <div className="border-none" />
          <div className="grid gap-6 px-4 text-left md:px-6 lg:gap-10 xl:gap-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Terms and Conditions</h1>
            </div>
            <div className="mx-auto prose max-w-5xl lg:prose-lg xl:prose-xl dark:prose-invert">
              <p>Please read these terms and conditions carefully before using the DotStack template.</p>
              <h2 className="text-2xl font-bold">Conditions of Use</h2>
              <p>
                We will provide our services to you, which are subject to the conditions stated below in this document.
                Every time you visit this website, use its services, or make a purchase, you accept the following
                conditions. This is why we urge you to read them carefully.
              </p>
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
              <p>
                Before you continue using our website, we advise you to read our privacy policy regarding our user data
                collection. It will help you better understand our practices.
              </p>
              <h2 className="text-2xl font-bold">License and Access</h2>
              <p>
                We grant you a limited license to access and make personal use of this website. You are not allowed to
                download or modify it. This may be done only with written consent from us.
              </p>
              <h2 className="text-2xl font-bold">User Account</h2>
              <p>
                If you are given an account, you are responsible for maintaining the confidentiality of your account and
                password and for restricting access to your computer. You agree to accept responsibility for all
                activities that occur under your account or password.
              </p>
              <h2 className="text-2xl font-bold">Limitation of Liability</h2>
              <p>
                We, the owner of this website, will not be held responsible for any damages that may occur, including but
                not limited to direct, indirect, special, incidental, consequential, or punitive damages.
              </p>
              <h2 className="text-2xl font-bold">Changes to Terms</h2>
              <p>
                We reserve the right to make changes to our site, policies, and these terms of use at any time. If any of
                these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be
                deemed severable and shall not affect the validity and enforceability of any remaining condition.
              </p>
            </div>
          </div>
          <div className="mt-auto border-t" />
        </div>
      </div>
    )
  }

export default TermsView;