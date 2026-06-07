import { merge } from 'lodash-es';
import Button from './Button';
import ButtonBase from './ButtonBase';
import Card from './Card';
import CardContent from './CardContent';
import Checkbox from './Checkbox';
import Chip from './Chip';
import Drawer from './Drawer';
import FormHelperText from './FormHelperText';
import IconButton from './IconButton';
import InputLabel from './InputLabel';
import InputBase from './InputBase';
import Link from './Link';
import ListItemButton from './ListItemButton';
import ListItemIcon from './ListItemIcon';
import OutlinedInput from './OutlinedInput';
import Paper from './Paper';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHead from './TableHead';
import TableRow from './TableRow';
import Typography from './Typography';
import Menu from './Menu';
import MenuItem from './MenuItem';
import Select from './Select';
import Popover from './Popover';
import Dialog from './Dialog';
import Alert from './Alert';

export default function ComponentsOverrides(theme) {
  return merge(
    Button(theme),
    ButtonBase(theme),
    Card(theme),
    CardContent(),
    Checkbox(theme),
    Chip(theme),
    Drawer(),
    FormHelperText(theme),
    IconButton(theme),
    InputLabel(theme),
    InputBase(theme),
    Link(),
    ListItemButton(theme),
    ListItemIcon(theme),
    OutlinedInput(theme),
    Paper(theme),
    TableBody(theme),
    TableCell(theme),
    TableHead(theme),
    TableRow(),
    Typography(),
    Menu(theme),
    MenuItem(theme),
    Select(theme),
    Popover(theme),
    Dialog(theme),
    Alert(theme)
  );
}
