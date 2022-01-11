import ProfilePage from "../pages/ProfilePage";
import ProfileViewModel from "../view-models/ProfileViewModel";

const ProfileView = () => (
    <ProfileViewModel>
        <ProfilePage />
    </ProfileViewModel>
);

export default ProfileView;