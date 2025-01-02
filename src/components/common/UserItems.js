import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear } from '@fortawesome/free-solid-svg-icons';


const UserItems = () => [
    {
        icon: (() => <FontAwesomeIcon icon={faHouse} />),
        label: "Home",
        url: '/'
    },
    {
        icon: (() => <FontAwesomeIcon icon={faGear} />),
        label: "Manage",
        url: '/manager'
    },
];

export default UserItems;
