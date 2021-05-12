import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NewsCard from './NewsCard';


export default function Navbar() {

  return (
    <>
      <AppBar position="static" className="root">
        <Toolbar>
          <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu">
          </IconButton>
          <Typography variant="h6" className="title">
            The News Time
          </Typography>
        </Toolbar>
      </AppBar>

    </>
  );
}
