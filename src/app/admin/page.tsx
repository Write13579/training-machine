import { getMe } from "../authutils";
import CreateExComp from "./CreateExComp";

export default async function AdminPage() {
  const user = await getMe();

  if (!user || !user.admin) {
    return <h1>Access Denied</h1>; // tu nic nie rob w ui bo i tak tego nie widac
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <div className="border-2 border-black p-4 rounded-md shadow-md m-8">
        <CreateExComp />
      </div>
    </div>
  );
}
