import { User, ChevronDown, Menu } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSidebar } from '../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      navigate('/login')
      localStorage.removeItem('schoolId');
      localStorage.removeItem('role');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const res = await fetch('http://localhost:3001/api/students/myinfo', {
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.data); 
          } else {
            console.error('Failed to fetch user info:', data.message);
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      };
  
      fetchUserInfo();
    }, []);

  return (
    <header className="bg-white shadow-lg p-4 flex items-center justify-between border">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium text-gray-700">Student Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="flex items-center gap-2">
              <User size={18} />
              <span>{user.name}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
