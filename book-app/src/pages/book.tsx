import { Container, Title, Text, Paper } from '@mantine/core';
// import styles from '../styles/Book.module.css'; // Optional: for CSS Modules

export default function BookPage() {
  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" radius="md">
        <Title order={1}>My Notes</Title>
        <Text mt="md">
          Welcome to my shared notes! This is a micro-frontend page built with Next.js and TypeScript.
        </Text>
        <Text mt="sm">
          Example note: This page is integrated into a React SPA using Module Federation.
        </Text>
      </Paper>
    </Container>
  );
}