# Library Portal (React)

A web-client application built with React for managing and accessing library resources.


## About

This project provides a client-side portal for a library management system. It allows users to browse, view, and manage library resources such as books, authors, categories, and publishers through an intuitive and responsive interface.

This repository covers the React client part of the system — the backend API is assumed to be a separate service providing data operations.

## Features

- Modern, responsive React UI
- 5 main pages:
  - Home – Overview of the portal
  - Books – View and manage the list of books
  - Categories – Organize and browse book categories
  - Publishers – Manage publisher details
  - Authors – View and edit author information
- Clean, modular component-based architecture
- REST API integration for data fetching and CRUD operations
- Easy to extend and maintain

## Tech Stack
- React (JavaScript)
- HTML5 / CSS3
- Bootstrap (for UI styling)
- Axios (for REST API communication)
- React Router (for page navigation)

## Getting Started
### Prerequisites
- Node.js (>= 12.x) and npm (or yarn) installed.
- Backend API service running (or mock API endpoints for testing).

## Installation
### Clone this repository:
```
git clone https://github.com/rashedulalam46/library-portal-react.git
cd library-portal-react
```
### Install dependencies:
```
npm install
```

### Running the App
```
npm start
```
The app will open in your browser at: http://localhost:3000/

## Usage

- Once the app is running:
- Visit the Home page for an overview.
- Navigate to Books, Categories, Publishers, or Authors pages to manage data.
- Use the navigation bar to switch between pages.
- Data operations (create, edit, delete) will reflect changes from/to the connected REST API.
