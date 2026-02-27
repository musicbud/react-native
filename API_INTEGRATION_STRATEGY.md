# API Integration Strategy for MusicBud React Native (Expo) App

This document outlines a proposed API integration strategy for the MusicBud React Native application, building upon the patterns observed in the previous Flutter project and adapting them for the React Native ecosystem.

## Core Principles:
*   **Layered Architecture:** Clear separation of concerns to enhance maintainability, scalability, and testability.
*   **Modularity:** Keep API logic organized by domain.
*   **Robust Error Handling:** Implement centralized error handling for network requests.
*   **Reusability:** Design services and repositories to be easily reusable across different parts of the application.

## Proposed Layers:

### 1. Network Layer (`src/services/apiService.ts`)

This layer will be responsible for making actual HTTP requests to the backend API.

*   **Technology:** `axios` is recommended over `fetch` due to its richer feature set, including request/response interceptors, automatic JSON transformation, and better error handling capabilities.
*   **Functionality:**
    *   **Base API Client:** Create a singleton `axios` instance configured with the base URL, default headers, and timeout settings.
    *   **Interceptors:**
        *   **Request Interceptors:** To automatically attach authentication tokens (e.g., JWT from `AsyncStorage` or a state management solution) to outgoing requests.
        *   **Response Interceptors:** To handle global error conditions (e.g., redirect to login on a 401 Unauthorized response, display generic error messages for 5xx errors).
        *   **Logging:** Integrate basic request/response logging for debugging purposes.

*   **Example (`src/services/apiService.ts`):**
    ```typescript
    import axios from 'axios';
    // import AsyncStorage from '@react-native-async-storage/async-storage'; // Requires installation

    const API = axios.create({
      baseURL: 'YOUR_BASE_API_URL_HERE', // **TODO: Replace with your actual API URL**
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor: Attach authentication token
    API.interceptors.request.use(
      async (config) => {
        // Example: Retrieve token from AsyncStorage
        // const token = await AsyncStorage.getItem('userToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle global API errors
    API.interceptors.response.use(
      (response) => response,
      (error) => {
        // Example: Redirect to login on 401 Unauthorized
        if (error.response && error.response.status === 401) {
          // **TODO: Implement unauthorized handling, e.g., navigate to login screen**
          console.error('Unauthorized access. Please log in again.');
        }
        // Example: Log other server errors
        if (error.response && error.response.status >= 500) {
          console.error('Server error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );

    export default API;
    ```

### 2. Data Sources Layer (`src/data/dataSources/`)

This layer will encapsulate the direct interactions with the `apiService` for specific API endpoints. Each data source will typically correspond to a domain or a set of related endpoints.

*   **Structure:** Create separate files for different logical groupings (e.g., `userDataSource.ts`, `musicDataSource.ts`, `chatDataSource.ts`, etc.).
*   **Responsibility:** These data sources will contain functions that call the `apiService` with specific endpoints and payloads. They return the raw data received from the API.

*   **Example (`src/data/dataSources/userDataSource.ts`):**
    ```typescript
    import API from '../../services/apiService';

    export const userDataSource = {
      getProfile: async (userId: string) => {
        const response = await API.get(`/users/${userId}/profile`);
        return response.data;
      },
      updateProfile: async (userId: string, data: any) => {
        const response = await API.put(`/users/${userId}/profile`, data);
        return response.data;
      },
      // TODO: Add other user-related API calls here
    };
    ```

### 3. Repositories Layer (`src/domain/repositories/` and `src/data/repositories/`)

This layer acts as an abstraction over the data sources, providing a clean interface for the application's business logic, regardless of where the data actually comes from (API, local storage, etc.).

*   **`src/domain/repositories/`:** Contains abstract interfaces (TypeScript interfaces) that define the contract for each repository. This promotes true decoupling.
    *   **Example (`src/domain/repositories/IUserRepository.ts`):**
        ```typescript
        export interface IUserRepository {
          getProfile(userId: string): Promise<any>;
          updateProfile(userId: string, data: any): Promise<any>;
          // TODO: Add other repository methods
        }
        ```
*   **`src/data/repositories/`:** Contains the concrete implementations of these interfaces, utilizing the data sources.
    *   **Example (`src/data/repositories/userRepository.ts`):**
        ```typescript
        import { IUserRepository } from '../../domain/repositories/IUserRepository';
        import { userDataSource } from '../dataSources/userDataSource';

        export class UserRepository implements IUserRepository {
          async getProfile(userId: string): Promise<any> {
            return userDataSource.getProfile(userId);
          }
          async updateProfile(userId: string, data: any): Promise<any> {
            return userDataSource.updateProfile(userId, data);
          }
          // TODO: Implement other methods
        }
        ```

### 4. State Management Layer

This layer is crucial for managing the application's state, including data fetched from the API, UI state, and user session information.

*   **Flutter's BLoC equivalent in React Native:**
    *   **Context API + `useReducer`:** Suitable for global state that doesn't change frequently or for managing state within a specific feature. It can get verbose for complex, large-scale state.
    *   **Redux Toolkit (RTK):** A powerful and opinionated solution for large applications. It provides utilities (`createSlice`, `createAsyncThunk`) to simplify Redux boilerplate and offers features like RTK Query for efficient data fetching, caching, and invalidation. This is a strong choice for complex apps with significant data interaction.
    *   **Zustand / Jotai:** More lightweight and flexible alternatives to Redux, often preferred for their simplicity and less boilerplate. They are great for managing smaller, independent pieces of state or for projects where Redux might be overkill.
    *   **React Query / SWR:** Primarily designed for server-state management. They handle caching, revalidation, optimistic updates, and error handling for asynchronous data. They are often used alongside a client-state management library (like Context API or Zustand) to manage UI-specific state.

*   **Recommendation & User Preference:**
    Considering the scope of a music-related social app, there will likely be substantial data fetching, caching, and real-time updates.
    **I recommend either Redux Toolkit (with RTK Query) or a combination of Zustand/Context API for client state and React Query for server state.**

    **Please let me know your preference for the state management solution, and I will integrate it into the plan.**

### 5. Dependency Injection (Optional but Recommended)

For better testability and modularity, especially with repositories, dependency injection can be used.

*   **Approach:** For React Native, a lightweight approach like simple constructor injection or using a dedicated DI container library (e.g., `inversify-js`) can be employed. For smaller projects, direct instantiation of repositories in the higher-level components or hooks might suffice.

## Next Steps:

Once a state management solution is chosen, I will incorporate its setup into the project and demonstrate how to fetch and display data using the defined API integration architecture.