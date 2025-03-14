export default function Loader() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative p-2 rounded-full">
          {/* Animated Border */}
          <div className="absolute inset-0 w-full h-full rounded-full p-[3px] animate-borderSpin">
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-500 rounded-full blur-xl xl:blur-2xl opacity-80 animate-borderSpin"
            ></div>
            {/* Shadow Effect */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-full"></div>
          </div>
  
          {/* Image */}
          <img
            src="/Loader Logo.png"
            alt="Loading..."
            className="relative w-40 h-w-40 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-64 lg:h-w-64 xl:w-[330px] xl:h-[330px] object-contain rounded-full"
          />
        </div>
      </div>
    );
  }
  