import { UserInformationForm } from "../components/user-information-form"
import Navbar from "../components/Navbar";

export default function UserInformationPage() {
  return (
    <>
    <Navbar />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Personal Information</h1>
          <p className="text-muted-foreground mb-8">
            Please provide your personal information before opening an account.
          </p>
          <UserInformationForm />
        </div>
      </div>
    </>
  )
}
