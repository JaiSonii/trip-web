'use client'
import OtpLogin from "@/components/OtpLogin";
function LoginPage() {

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-bold text-center mb-5">
        Login to Mo-Verse Trip Management
      </h1>

      <OtpLogin />
    </div>
  );
}

export default LoginPage;
