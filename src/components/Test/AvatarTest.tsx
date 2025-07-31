import Avatar from '../Common/Avatar';

const AvatarTest = () => {
  const testUsers = [
    {
      name: 'Google User',
      profilePicture: 'https://lh3.googleusercontent.com/a/default-user',
      avatar: null,
      role: 'agent'
    },
    {
      name: 'Regular User',
      profilePicture: null,
      avatar: 'https://via.placeholder.com/150',
      role: 'enterprise'
    },
    {
      name: 'No Image User',
      profilePicture: null,
      avatar: null,
      role: 'agent'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Test des Avatars</h1>
      
      {testUsers.map((user, index) => (
        <div key={index} className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-4">{user.name}</h3>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Avatar src={user.profilePicture || user.avatar} alt={user.name} size="sm" />
              <p className="text-xs mt-1">Small</p>
            </div>
            <div className="text-center">
              <Avatar src={user.profilePicture || user.avatar} alt={user.name} size="md" />
              <p className="text-xs mt-1">Medium</p>
            </div>
            <div className="text-center">
              <Avatar src={user.profilePicture || user.avatar} alt={user.name} size="lg" />
              <p className="text-xs mt-1">Large</p>
            </div>
            <div className="text-center">
              <Avatar src={user.profilePicture || user.avatar} alt={user.name} size="xl" />
              <p className="text-xs mt-1">Extra Large</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Profile Picture: {user.profilePicture || 'None'}</p>
            <p>Avatar: {user.avatar || 'None'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvatarTest;