import AddressForm from 'components/AddressForm';
import ProfileForm from 'components/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 space-y-10">
      <ProfileForm />
      <AddressForm />
    </div>
  );
}
