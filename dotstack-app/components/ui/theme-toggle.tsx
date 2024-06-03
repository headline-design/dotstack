import { useTheme } from 'next-themes';
import { Button } from './button';
import React from 'react';
import { IconMoon, IconSun } from '@/dotstack-app/icons';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
    size="sm"
    className="ml-4"
    variant={"ghost"}

      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      {resolvedTheme === 'light' ? <IconMoon  /> : <IconSun  />}
    </Button>
  );
};

export default React.memo(ThemeToggle);
