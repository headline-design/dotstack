/* eslint-disable react/no-unescaped-entities */

const PrivacyView = () => {
    return (
      <div className="py-12 lg:py-24 xl:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto prose max-w-5xl lg:prose-lg xl:prose-xl dark:prose-invert">
            <div className="space-y-4">
              <h1 className="text-3xl font-extrabold tracking-tighter sm:text-5xl sm:tracking-tighter/relaxed lg:text-6xl dark:text-gray-100">
                Privacy Policy
              </h1>
              <p>
                The DotStack app respects your privacy and is committed to protecting your personal data. This privacy
                policy will inform you about how we collect, use, and protect your data when you use our app.
              </p>
            </div>
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Data Collection</h2>
                <p>
                  The DotStack app may collect personal information provided by users, such as names, email addresses,
                  and profile information. Additionally, the app may collect usage data, including interactions within the
                  app, device information, and cookies. This data is obtained through user input and automatic collection
                  during app usage.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Data Usage</h2>
                <p>
                  The collected data is used to personalize the user experience within the app, provide analytics on app
                  usage, and improve the app's features. The app does not share personal information with third parties,
                  except for service providers that assist in app operations.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Data Protection</h2>
                <p>
                  The DotStack app employs security measures to protect user data, including encryption of data
                  transmission and secure storage of user information. The app follows best practices to safeguard user
                  privacy.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold tracking-tight">User Rights</h2>
                <p>
                  Users have the right to request access to their personal data collected by the app, as well as the right
                  to correct or delete inaccurate information. Users can exercise these rights by contacting the app's
                  privacy team through the provided contact information.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Cookies</h2>
                <p>
                  The DotStack app uses cookies to enhance the user experience and provide personalized features. Users
                  can manage cookie preferences through their browser settings.
                </p>
              </section>
              <section>
                <h2 className="text-2xl font-bold tracking-tight">Third-Party Links</h2>
                <p>
                  The app may contain links to third-party websites or services. Users should review the privacy policies
                  of those websites, as the app is not responsible for the data practices of third-party sites.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default PrivacyView;