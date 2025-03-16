import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <>
      <div className="w-full h-fit md:max-h-screen grid grid-cols-4">
        <div className="col-span-3 h-screen">
          <img
            src="public/yarn_beach.webp"
            alt="cover image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full flex flex-col justify-center bg-neutral/10">
          <div role="tablist" className="tabs tabs-lifted">
            {/* Tab 1 */}
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className="tab"
              aria-label="Archive"
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 p-6"
            >
              <LoginForm goTo="admin" />
            </div>

            {/* Tab 2 */}
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className="tab"
              aria-label="Compose"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 p-6"
            >
              <LoginForm goTo="chordify" />
            </div>

            {/* Tab 3 */}
            <input
              type="radio"
              name="my_tabs"
              role="tab"
              className="tab"
              aria-label="Play"
              defaultChecked
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 p-6"
            >
              <LoginForm goTo="player" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
