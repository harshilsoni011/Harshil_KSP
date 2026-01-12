import React from "react";
import { useAppSelector } from "../../store/hooks";

const Profile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profileUser, setProfileUser] = React.useState(user);

  React.useEffect(() => {
    // Initialize with stored user
    if (user) setProfileUser(user);

    // Fetch fresh data
    const fetchMe = async () => {
      try {
        const { kspAPI } = await import("../../utils/api");
        const res = await kspAPI.getMe();
        if (res.data && res.data.user) {
          setProfileUser(res.data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchMe();
  }, [user]);

  return (
    <div className="container py-4">
      <div className="profile-header mb-4">
        <h2>
          <i className="bi bi-person-circle me-2" />
          My Profile
        </h2>
      </div>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card profile-card">
            <div className="card-body text-center">
              <div className="profile-avatar">
                <span className="avatar-initial">
                  {profileUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <h4 className="mt-3 mb-1">{profileUser?.name || "User"}</h4>
              <p className="text-muted mb-3">
                <i className="bi bi-envelope-fill me-1" />
                {profileUser?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card profile-details-card">
            <div className="card-body">
              <h5 className="card-title mb-4">
                Profile Details
              </h5>
              <dl className="row profile-details">
                <dt className="col-sm-4">
                  <i className="bi bi-person-fill me-2 text-primary" />
                  Name
                </dt>
                <dd className="col-sm-8">{profileUser?.name || "Someone"}</dd>
                <dt className="col-sm-4">
                  <i className="bi bi-envelope-fill me-2 text-primary" />
                  Email
                </dt>
                <dd className="col-sm-8">{profileUser?.email || "Someone"}</dd>
                <dt className="col-sm-4">
                  <i className="bi bi-star-fill me-2 text-warning" />
                  Reputation
                </dt>
                <dd className="col-sm-8">
                  <span className="badge bg-success fs-6">
                    {profileUser?.reputation ?? 0} points
                  </span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

