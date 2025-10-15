import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

export function PrivacyPage() {
    const policySections = [
        {
            title: "1. Сбор информации",
            content: "Мы собираем только необходимую информацию для предоставления наших услуг."
        },
        {
            title: "2. Использование данных",
            content: "Ваши данные используются исключительно для организации спортивных мероприятий."
        },
        {
            title: "3. Защита информации",
            content: "Мы применяем современные методы шифрования и защиты данных."
        },
        {
            title: "4. Правовые основания",
            content: "Обработка данных осуществляется в соответствии с законодательством РБ."
        },
        {
            title: "5. Ваши права",
            content: "Вы можете запросить доступ, исправление или удаление ваших данных."
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" mb={4}>
                <SecurityIcon fontSize="large" sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
                    Политика конфиденциальности
                </Typography>
            </Box>

            <Box sx={{
                p: 4,
                mb: 4,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                textAlign: 'center'
            }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                    Общие положения
                </Typography>
            </Box>

            <List sx={{
                width: '100%',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 1,
                overflow: 'hidden'
            }}>
                {policySections.map((section, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start" sx={{ py: 3 }}>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        {section.title}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                                        {section.content}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        {index < policySections.length - 1}
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
}