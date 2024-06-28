import Head from 'next/head';
import CreateQuizForm from '@/components/CreateQuizForm';

const CreateQuizPage = () => {
  return (
    <>
      <Head>
        <title>Create Quiz - Quiz App</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="text-center p-10 bg-black bg-opacity-40 backdrop-blur-sm rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-4">Create a Quiz</h1>
          <CreateQuizForm />
        </div>
      </div>
    </>
  );
};

export default CreateQuizPage;
