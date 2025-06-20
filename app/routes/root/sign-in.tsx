import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) {
      // If user is already logged in, redirect to the home page
      return redirect("/");
    }
  } catch (error) {
    console.log("Error in clientLoader: Fetching user - ", error);
  }
}

const SignIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/" className="logo">
              <img
                src="/assets/icons/logo.svg"
                alt="Logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourismo</h1>
          </header>
          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start your Travel journey
            </h2>
            <p className="p-18-regular text-gray-100 text-center !leading-7">
              Sign In with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>
          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={loginWithGoogle}
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google Logo"
              className="size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
