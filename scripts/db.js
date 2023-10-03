function DB() {}

DB.data = {
    "relations": {
        "debt_status": [
            "Cancelada",
            "Pendiente",
            "Anulada"
        ],
        "user_status": [
            "Activo",
            "Inactivo"
        ],
        "change_status": [
            "Realizados",
            "Pendiente",
            "Descartados"
        ],
        "payment_type": [
            "Contado",
            "Crédito"
        ],
        "sex": [
            "Masculino",
            "Femenino"
        ]
    },
    "states": [
        {
            "id": "0",
            "state_name": "Amazonas"
        },
        {
            "id": "1",
            "state_name": "Anzoategui"
        },
        {
            "id": "2",
            "state_name": "Apure"
        },
        {
            "id": "3",
            "state_name": "Aragua"
        },
        {
            "id": "4",
            "state_name": "Barinas"
        },
        {
            "id": "5",
            "state_name": "Bolívar"
        },
        {
            "id": "6",
            "state_name": "Carabobo"
        },
        {
            "id": "7",
            "state_name": "Cojedes"
        },
        {
            "id": "8",
            "state_name": "Delta Amacuro"
        },
        {
            "id": "9",
            "state_name": "Falcón"
        },
        {
            "id": "10",
            "state_name": "Guárico"
        },
        {
            "id": "11",
            "state_name": "Lara"
        },
        {
            "id": "12",
            "state_name": "Mérida"
        },
        {
            "id": "13",
            "state_name": "Miranda"
        },
        {
            "id": "14",
            "state_name": "Monagas"
        },
        {
            "id": "15",
            "state_name": "Nueva Esparta"
        },
        {
            "id": "16",
            "state_name": "Portuguesa"
        },
        {
            "id": "17",
            "state_name": "Sucre"
        },
        {
            "id": "18",
            "state_name": "Táchira"
        },
        {
            "id": "19",
            "state_name": "Trujillo"
        },
        {
            "id": "20",
            "state_name": "Yaracuy"
        },
        {
            "id": "21",
            "state_name": "Zulia"
        },
        {
            "id": "22",
            "state_name": "Dependencias Federales"
        },
        {
            "id": "23",
            "state_name": "Distrito Federal"
        },
        {
            "id": "24",
            "state_name": "Vargas"
        }
    ],
    "collection_tables": [
        {
            "invoice_number": "FAC006291",
            "client_rif": "J-500568461",
            "dollar_amount": "118,91",
            "bolivar_amount": "2901,42",
            "remaining_debt": "0",
            "exchange_rate": "24,40",
            "expiration_date": "2023-10-20",
            "user_id": "28204620",
            "payment_type": "0",
            "debt_status": "1",
            "observation": "VENCIDA",
            "creation_date": "2023-10-2"
        },
        {
            "invoice_number": "FAC006292",
            "client_rif": "J-303578888",
            "dollar_amount": "297,91",
            "bolivar_amount": "7225,18",
            "remaining_debt": "50",
            "exchange_rate": "24,31",
            "expiration_date": "2023-10-15",
            "user_id": "28204620",
            "payment_type": "0",
            "debt_status": "0",
            "observation": "El 09/19/2023 se abono 6402,74bs a la tasa 25,90bs el dólar. Fueron 247,21$, faltan 50$",
            "creation_date": "2023-10-2"
        },
        {
            "invoice_number": "FAC006293",
            "client_rif": "J-5235425461",
            "dollar_amount": "301,37",
            "bolivar_amount": "10306,17",
            "remaining_debt": "100",
            "exchange_rate": "34.2",
            "expiration_date": "2023-10-26",
            "user_id": "28316086",
            "payment_type": "1",
            "debt_status": "1",
            "observation": "Pagaron 201 el 09/23/2023",
            "creation_date": "2023-10-2"
        },
        {
            "invoice_number": "FAC006294",
            "client_rif": "J-123456780",
            "dollar_amount": "50",
            "bolivar_amount": "1750",
            "remaining_debt": "0",
            "exchange_rate": "35",
            "expiration_date": "2023-10-2",
            "user_id": "28316086",
            "payment_type": "0",
            "debt_status": "2",
            "observation": "Regresaron la mercancía. ",
            "creation_date": "2023-10-2"
        }
    ],
    "collection_tables_changes": [
        {
            "id": 1,
            "request_date": "2023-10-2",
            "change_status": 1,
            "invoice_number": "FAC006292",
            "client_rif": "J-303578888",
            "dollar_amount": "297,91",
            "bolivar_amount": "7225,18",
            "remaining_debt": "20",
            "exchange_rate": "24,31",
            "expiration_date": "2023-10-15",
            "user_id": "28204620",
            "payment_type": "0",
            "debt_status": "0",
            "observation": "El 09/19/2023 se abono 6402,74bs a la tasa 25,90bs el dólar. Fueron 247,21$, faltan 50$, Se abonaron 30$ el 10/02/2023 a la tasa de 35bs, en total 1050bs",
            "creation_date": "2023-10-2"
        }
    ],
    "reminders": [
        {
            "id": 1,
            "to_user_id": "28316086",
            "by_user_id": "28019240",
            "message": "Atención a los retrasos ",
            "execute_date": "2023-10-24"
        },
        {
            "id": 2,
            "to_user_id": "28204620",
            "by_user_id": "28019240",
            "message": "Deuda Cancelada",
            "execute_date": "2023-10-19"
        }
    ],
    "employees": [
        {
            "user_id": "28019240",
            "name": "alirio",
            "surname": "freytez",
            "phone_number": "+4121112233",
            "email": "email@domain.com",
            "sex": "0",
            "position": "0",
            "entry_date": "2023-8-14",
            "exit_date": "",
            "status": "0"
        },
        {
            "user_id": "28204620",
            "name": "anthony",
            "surname": "moreno",
            "phone_number": "+58123465975",
            "email": "antho@algo.com",
            "sex": "0",
            "position": "1",
            "entry_date": "2023-8-14",
            "exit_date": "",
            "status": "0"
        },
        {
            "name": "Hanuman",
            "surname": "Sanchez",
            "user_id": "28316086",
            "phone_number": "+584240808912",
            "email": "hanumansanchez@gmail.com",
            "entry_date": "2023-02-17",
            "exit_date": "",
            "sex": "0",
            "position": "1"
        }
    ],
    "user_access": [
        {
            "user_id": "28019240",
            "password": "clave123",
            "creation_date": "2023-9-14"
        },
        {
            "user_id": "28204620",
            "password": "clave123",
            "creation_date": "2023-9-14"
        },
        {
            "user_id": "28316086",
            "password": "clave123",
            "creation_date": "2023-10-2"
        }
    ],
    "positions": [
        {
            "id": "0",
            "position_name": "Administrador"
        },
        {
            "id": "1",
            "position_name": "Vendedor"
        }
    ],
    "clients": [
        {
            "client_rif": "J-12345678",
            "client_name": "Farmacia Santander"
        },
        {
            "client_rif": "J-12345671",
            "client_name": "Farmacia San Cristobal"
        },
        {
            "client_rif": "J-12345672",
            "client_name": "Farmacia San Agustin"
        },
        {
            "client_rif": "J-12345673",
            "client_name": "Farmacia Colondrina"
        },
        {
            "client_rif": "J-12345623",
            "client_name": "Farmacia Girasol"
        },
        {
            "client_rif": "J-12345615",
            "client_name": "Farmatodo"
        },
        {
            "client_rif": "J-12345647",
            "client_name": "Farmacia San Ignacio"
        },
        {
            "client_rif": "J-12345692",
            "client_name": "Farmacia Nuevo Siglo"
        }
    ]
};

DB.initialized = false;
DB.ini = function() {
    DB.initialized = true;

    if (localStorage.getItem("data") != undefined)
        return true;

    localStorage.setItem("data", JSON.stringify(DB.data));
    return true;
}
DB.getIndex = function({ table, condition }) {
    if (!DB.initialized)
        return DB.ini();

    if (condition != undefined) {
        const conditions = Object.entries(condition);
        const data = JSON.parse(localStorage.getItem("data"))[table];
        const index = data.findIndex(row => {
            const result = conditions.map(([ key, value ]) => row[key] == value)
            return !result.some(e => e == false);
        });

        return index;
    }
}
DB.interpolate = function({ type, value }) {
    return DB.get({ table: "relations" })[type][value];
}
DB.get = function({ table, condition, key, all = false }) {
    if (!DB.initialized)
        return DB.ini();
    
    let data = JSON.parse(localStorage.getItem("data"));

    if (all) {
        data = data[table].filter((row) => Object.entries(condition).every(([key, value]) => row[key] == value));
    } else {
        if (Array.isArray(data[table]))
            data = condition != undefined ? data[table][DB.getIndex({ table, condition })] : data[table];
        else {
            data = key != undefined ? data[table][key] : data[table];
        }
    }

    return data;
}
DB.post = function({ table, condition, data }) {
    if (!DB.initialized)
        return DB.ini();

    const DBData = JSON.parse(localStorage.getItem("data"));
    const index = DB.getIndex({ table, condition });
    
    Object.entries(data).forEach(([ key, value ]) => DBData[table][index][key] = value);
    localStorage.setItem("data", JSON.stringify(DBData));

    return true;
}
DB.put = function({ table, data }) {
    if (!DB.initialized)
        return DB.ini();

    const condition = {
        collection_tables: (data) => ({
            invoice_number: data.invoice_number
        }),
        user_access: (data) => ({
            user_id: data.user_id
        }),
        employees: (data) => ({
            user_id: data.user_id
        }),
        reminders: (data) => ({
            id: data.id
        }),
        positions: (data) => ({
            id: data.id
        }),
        clients: (data) => ({
            client_rif: data.client_rif
        }),
        collection_tables_changes: (data) => ({
            invoice_number: data.invoice_number,
            change_status: data.change_status
        })
    }[table](data);

    const DBData = JSON.parse(localStorage.getItem("data"));
    const index = DB.getIndex({ table, condition });

    if (index !== -1)
        return false;

    DBData[table].push(data);
    localStorage.setItem("data", JSON.stringify(DBData));

    return true;
}
DB.delete = function({ table, condition }) {
    if (!DB.initialized)
        return DB.ini();

    
    const DBData = JSON.parse(localStorage.getItem("data"));
    const index = DB.getIndex({ table, condition });
    
    if (index === -1)
        return false;
    else if (index == 0)
        DBData[table].shift(index);
    else if (index == DBData[table].length-1)
        DBData[table] = DBData[table].slice(0, index);
    else
        DBData[table] = DBData[table].slice(0, index).concat(DBData[table].slice(index+1));

    localStorage.setItem("data", JSON.stringify(DBData));

    return true;
}

export default DB;