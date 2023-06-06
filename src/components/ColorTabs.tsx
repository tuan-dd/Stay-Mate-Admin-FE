import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { SxProps } from '@mui/material';
import { IActions } from '@/utils/interface';

export default function ColorTabs({
  tabs,
  handleChange,
  value,
  orientation,
  sx,
  sxTab,
}: {
  tabs: string[] | IActions[];
  handleChange: (event: React.SyntheticEvent, newValue: string) => void;
  value: string;
  orientation: 'horizontal' | 'vertical';
  sx?: SxProps;
  sxTab?: SxProps;
}) {
  return (
    <>
      <Tabs
        orientation={orientation}
        value={value}
        onChange={handleChange}
        textColor='secondary'
        indicatorColor='secondary'
        aria-label='secondary tabs example'
        sx={{ ...sx }}
      >
        {tabs.map((tab) => {
          if (typeof tab === 'string')
            return (
              <Tab
                key={tab}
                value={tab}
                label={tab}
                sx={{ fontSize: 18, justifyContent: 'space-around', ...sxTab }}
              />
            );

          return (
            <Tab
              key={tab.name}
              value={tab.name}
              label={tab.name}
              icon={tab.icon}
              iconPosition='start'
              sx={{ fontSize: 18, justifyContent: 'flex-start', ...sxTab }}
            />
          );
        })}
      </Tabs>
    </>
  );
}
