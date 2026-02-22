export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent dark:from-blue-600/20 dark:via-purple-600/10 pointer-events-none" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            AdScore AI
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            AI-Powered Ad Creative Analysis
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
