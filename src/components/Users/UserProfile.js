import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) {
    return <p className="text-center mt-5">Please log in to view your profile.</p>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow mb-4">
        {/* Header with back button */}
        <div className="card-header py-3 bg-primary text-white d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold">User Profile</h6>
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Card Body */}
        <div className="card-body d-flex flex-column flex-md-row align-items-center">
          {/* Column 1: Profile Image */}
          <div className="col-md-3 text-center mb-4 mb-md-0">
            <img
              src={`/assets/img/${user.role_name.toLowerCase()}.svg`}
              alt="Profile"
              className="rounded-circle shadow"
              style={{ width: "180px", height: "180px", border: "4px solid #4e73df" }}
            />
            
          </div>

          {/* Column 2: User Info */}
          <div className="col-md-5 text-left text-md-start">
            <h3 className="font-weight-bold mb-4 ">{user.full_name}</h3>
            <p className="text-muted mb-1"><strong>Role:</strong> {user.role_name}</p>
            <p className="text-muted mb-1"><strong>Role ID:</strong> {user.role_id}</p>
            <p className="text-muted mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="text-muted mb-1"><strong>Phone:</strong> {user.phone || "Not Set"}</p>
            <p className="text-muted mb-1"><strong>Location:</strong> {user.address || "Not Provided"}</p>
          </div>

          {/* Column 3: KPI Cards / Stats */}
          <div className="col-md-4">
            <div className="row text-center">
              <div className="col-12 mb-3">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Sales Completed
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">120</div>
                  </div>
                </div>
              </div>
              <div className="col-12 mb-3">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Purchases Made
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">35</div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Projects Assigned
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">5</div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* End KPI Column */}
        </div> {/* End Card Body */}
      </div>
    </div>
  );
}
