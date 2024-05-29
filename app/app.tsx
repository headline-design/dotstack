"use client";

import React from 'react';
import { Provider } from 'react-redux';
import AppProvider from '@/dashboard/providers/AppProvider';

import { configureReduxStores } from '@/dashboard/redux/store';

const store = configureReduxStores();

export default function App () {

return (
    <Provider store={store}>
      <AppProvider />
    </Provider>
);
}
