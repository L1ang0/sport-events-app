import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Avatar,
  TableSortLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { userApi } from '../../shared/api/users';
import { useAuth } from '../../shared/hooks/userAuth';

export function UsersPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all', 'admins', 'users'
  
  // Состояние для сортировки
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const columns = [
    { id: 'avatar', label: '', minWidth: 60, sortable: false },
    { id: 'name', label: 'Имя', minWidth: 150, sortable: true },
    { id: 'email', label: 'Email', minWidth: 200, sortable: true },
    { id: 'phone', label: 'Телефон', minWidth: 150, sortable: true },
    { id: 'roles', label: 'Роли', minWidth: 200, sortable: false },
    { id: 'actions', label: 'Действия', minWidth: 100, sortable: false }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleFilterOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    setPage(0);
    handleFilterClose();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (userToDelete) {
        await userApi.delete(userToDelete.id);
        fetchUsers(); // Обновляем список после удаления
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    // Применяем фильтр по ролям
    const roleFilterPassed = 
      currentFilter === 'all' ||
      (currentFilter === 'admins' && user.roles?.some(role => role.name === 'ADMIN')) ||
      (currentFilter === 'users' && !user.roles?.some(role => role.name === 'ADMIN'));
    
    // Применяем поисковый запрос
    const searchLower = searchTerm.toLowerCase();
    const searchPassed = 
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower) ||
      user.roles?.some(role => role.name.toLowerCase().includes(searchLower));
    
    return roleFilterPassed && searchPassed;
  });

  const sortedUsers = stableSort(filteredUsers, getComparator(order, orderBy));

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Ошибка загрузки данных: {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchUsers}
        >
          Повторить попытку
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight={700}
        sx={{
          transform: '-moz-initial',
          transition: 'transform 0.8s',
          '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          background: 'linear-gradient(45deg, #29a6d2 30%, #31a6f3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}}>
          Пользователи
        </Typography>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 400 }}
          />
          <Box>
            <Tooltip title="Фильтры">
              <IconButton onClick={handleFilterOpen}>
                <FilterIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              <MenuItem 
                onClick={() => handleFilterSelect('all')}
                selected={currentFilter === 'all'}
              >
                Все пользователи
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterSelect('admins')}
                selected={currentFilter === 'admins'}
              >
                Только администраторы
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterSelect('users')}
                selected={currentFilter === 'users'}
              >
                Только пользователи
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                        {orderBy === column.id ? (
                          <Box component="span" sx={{ display: 'none' }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <TableRow hover key={user.id}>
                    <TableCell>
                      <Avatar src={user.avatar_url} alt={user.name} 
                      sx={{transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        background: 'linear-gradient(45deg, #ffffff 30%, #fafafa 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}}>
                        {user.name?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon color="action" />
                        <Typography>{user.name || 'Не указано'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        gap={1}
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          cursor: 'pointer',
                          background: 'linear-gradient(45deg, #29a6d2 30%, #31a6f3 90%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        } } }}
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        <EmailIcon color="action" />
                        <Typography>{user.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {user.phone ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon color="action" />
                          <Typography>{user.phone}</Typography>
                        </Box>
                      ) : (
                        <Typography color="textSecondary">Не указан</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {user.roles?.length > 0 ? (
                          user.roles.map(role => (
                            <Chip
                              key={role.id}
                              label={role.name}
                              size="small"
                              color={
                                role.name === 'ADMIN' ? 'primary' : 'default'
                              }
                              sx={{transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'translateY(-0.5px)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                                background: 'linear-gradient(45deg, #ffffff 30%, #31a6f3 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}}
                            />
                          ))
                        ) : (
                          <Typography color="textSecondary">Нет ролей</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {isAdmin && user.roles?.some(role => role.name !== 'ADMIN') && (
                        <Tooltip title="Удалить">
                          <IconButton
                            onClick={() => handleDeleteClick(user)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={sortedUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить пользователя {userToDelete?.name} ({userToDelete?.email})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}