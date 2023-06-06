import React from 'react';
import Box from '@mui/material/Box';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ListHotel from '@components/homepage/ListHotel';
import User from '@components/homepage/User';
import ColorTabs from '@components/ColorTabs';
import MemberShip from '@/reducer/membership/MemberShip';

const tabs = [
  { name: 'My Hotels', component: <ListHotel />, icon: <MapsHomeWorkIcon /> },
  { name: 'Account', component: <User />, icon: <ManageAccountsIcon /> },
  { name: 'MemberShip', component: <MemberShip />, icon: <CardMembershipIcon /> },
];

function HomePage() {
  const [currentTab, setCurrentTab] = React.useState<string>(tabs[0].name);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Box mt={7}>
        <ColorTabs
          tabs={tabs}
          value={currentTab}
          orientation='horizontal'
          handleChange={handleChangeTab}
        />
        {tabs.map(
          (tab) =>
            tab.name === currentTab && (
              <Box sx={{ mt: 1, width: '100%' }} key={tab.name}>
                {tab.component}
              </Box>
            )
        )}
      </Box>
    </>
  );
}

export default HomePage;
