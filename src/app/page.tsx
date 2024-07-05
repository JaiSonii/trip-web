

import PhoneSignIn from "@/components/auth/PhoneSignIn";
import Image from "next/image";
import Link from "next/link";

import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  return (
    <div>
      <PhoneSignIn />
    </div>
  );
}
