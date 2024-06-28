import SignupForm from '../components/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center">
      <h1 className="text-4xl text-white font-bold mb-8">Signup Page</h1>
      <SignupForm />
    </div>
  );
};

export default Signup;