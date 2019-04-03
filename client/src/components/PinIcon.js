import React from 'react';
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone';

export default ({ color, size, onClick }) => (
    <PlaceTwoTone style={{ fontSize: size, color}} onClick={onClick} />
);
