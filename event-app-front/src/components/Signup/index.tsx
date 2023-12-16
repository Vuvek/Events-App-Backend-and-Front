import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { BounceLoader } from "react-spinners";
import { ErrorMessage, Form, Formik } from "formik";
import { useToasts } from "react-toast-notifications";
import { SIGNUP_USER } from "../../gqloperations/mutations";
import { SingupInitialValues } from "../../utils/fileConstant";

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function SignUp() {
  // notification hooks
  const { addToast } = useToasts();

  // GrahpQL hooks
  const [signupUser, { loading }] = useMutation(SIGNUP_USER, {
    onCompleted(data) {
      addToast("SignUp Successfull Please Login", { appearance: "success" });
    },
    onError(error) {
      addToast(error.message, { appearance: "error" });
    },
  });

  if (loading)
    return (
      <div className="w-full h-screen flex items-start justify-center absolute top-[45%]">
        <BounceLoader color="black" size={60} />
      </div>
    );

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("First Name is Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Last Name is Required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is Required"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleSubmit = (formData: IFormData) => {
    signupUser({
      variables: {
        userNew: formData,
      },
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            SignUp in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={SingupInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formikProps) => {
              const { values, handleChange, handleBlur } = formikProps;
              return (
                <>
                  <Form className="space-y-6" action="#" method="POST">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First Name
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="firstName"
                          name="firstName"
                          type="firstName"
                          autoComplete="firstName"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last Name
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="lastName"
                          name="lastName"
                          type="lastName"
                          autoComplete="lastName"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <div className="mt-2 relative">
                        <input
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Password
                        </label>
                      </div>
                      <div className="mt-2 relative">
                        <input
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign in
                      </button>
                    </div>
                  </Form>
                </>
              );
            }}
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an Account ?{" "}
            <Link
              to="/signin"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
