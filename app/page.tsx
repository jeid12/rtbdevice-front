import Image from "next/image";
import Link from "next/link";

const RTB_COLORS = {
  primary: "rgb(109, 170, 226)", // Example RTB blue-green
  accent: "#F9B233", // Example RTB yellow
};

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #eaf3fa 0%, #f8fafc 100%)' }}>
      {/* Navbar */}
      <nav
        className="w-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 shadow-sm gap-2 sm:gap-0"
        style={{ background: RTB_COLORS.primary }}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
          <Image src="/rtb-logo.png" alt="RTB Logo" width={36} height={36} />
          <span className="text-white text-lg sm:text-xl font-bold text-center">
            Rwanda TVET Board Devices Management System
          </span>
        </div>
        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
          <Link href="/" className="text-white text-base font-semibold hover:underline px-2">
            Home
          </Link>
          <Link
            href="/login"
            className="ml-2 sm:ml-4 px-4 py-2 rounded-full font-bold text-base"
            style={{ background: RTB_COLORS.accent, color: RTB_COLORS.primary }}
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main Sections */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-6 sm:py-8 gap-6 sm:gap-10">
        {/* Section 1: Welcome & Purpose */}
        <section className="w-full max-w-lg sm:max-w-3xl text-center mb-3 bg-white/95 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[var(--rtb-primary,rgb(16,69,119))]">
            Welcome to the Rwanda TVET Board Devices Management System
          </h1>
          <p className="text-base sm:text-lg text-gray-800 font-medium mb-2">
            This platform is designed to help schools efficiently manage, track, and report on all devices owned by the institution.
          </p>
          <p className="text-sm sm:text-base text-gray-700 font-normal">
            Our goal is to ensure transparency, accountability, and optimal utilization of educational resources across all TVET schools in Rwanda.
          </p>
        </section>

        {/* Section 2: About RTB */}
        <section className="w-full max-w-lg sm:max-w-3xl text-center mb-3 bg-gray-50 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-[var(--rtb-primary,rgb(16,69,119))]">About Rwanda TVET Board (RTB)</h2>
          <p className="text-sm sm:text-base text-gray-800 font-normal">
            The Rwanda TVET Board (RTB) is a government institution responsible for promoting and coordinating Technical and Vocational Education and Training (TVET) in Rwanda. RTB aims to equip Rwandans with practical skills and knowledge to meet the demands of the labor market and foster national development.
          </p>
        </section>

        {/* Section 3: Contacts */}
        <section className="w-full max-w-lg sm:max-w-3xl text-center bg-gray-100 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 text-[var(--rtb-primary,rgb(16,69,119))]">Contact Us</h2>
          <p className="text-sm sm:text-base text-gray-800 font-medium mb-1">Rwanda TVET Board Headquarters</p>
          <p className="text-sm sm:text-base text-gray-800 font-medium mb-1">Kigali, Rwanda</p>
          <p className="text-sm sm:text-base text-gray-800 font-medium mb-1">Phone: +250 788 888 888</p>
          <p className="text-sm sm:text-base text-gray-800 font-medium mb-1">Email: info@rtb.gov.rw</p>
          <p className="text-sm sm:text-base text-gray-800 font-medium">Website: <a href="https://rtb.gov.rw" className="text-blue-700 underline font-semibold" target="_blank" rel="noopener noreferrer">rtb.gov.rw</a></p>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-sm text-gray-500 border-t bg-gray-50">
        &copy; {currentYear} Rwanda TVET Board (RTB). All rights reserved.
      </footer>
    </div>
  );
}
