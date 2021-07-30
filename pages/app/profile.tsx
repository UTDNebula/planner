import Head from 'next/head';
import { useAuthContext } from '../../modules/auth/auth-context';
import { useUserProfileData } from '../../modules/profile/userProfileData';
import CourseAudit from '../../components/planner/history/StudentHistoryView/CourseAudit';

/**
 * A page containing student attributes and other account settings.
 */
export default function ProfilePage(): JSX.Element {
  const { user } = useAuthContext();
  const { userInfo } = useUserProfileData(user.id);
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your profile</title>
      </Head>
      <div className="max-w-6xl">
        <section className="p-4">
          <div className="text-headline5 font-bold">Your information</div>
          <div className="md:grid-col-3">
            <div>
              <div className="text-body1">Preferred Name</div>
              <div className="text-body2">{userInfo.preferredName}</div>
            </div>
          </div>
        </section>
        <section className="p-4">
          <div className="text-headline5 font-bold">Account management</div>
        </section>
        <section className="p-4">
          <div className="text-headline5 font-bold">Course History</div>
          {CourseAudit()}
        </section>
      </div>
    </main>
  );
}
