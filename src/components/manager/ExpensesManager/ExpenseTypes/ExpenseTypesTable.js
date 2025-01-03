import React from "react";
import { useNavigate } from "react-router-dom";

import { EXPENSE_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import { Button, SIZE } from "baseui/button";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';


const itemOverrides = {
    overrides: {
        Block: {
            style: {
                gap: '5px',
                display: 'flex'
            }
        }
    }
};

const overrides = {
    TableBodyRow: {
      style: ({ $theme, $rowIndex }) => ({
        backgroundColor:
          $rowIndex % 2
            ? $theme.colors.backgroundPrimary
            : $theme.colors.backgroundSecondary,
        ":hover": {
          backgroundColor: $theme.colors.backgroundTertiary,
        },
      }),
    },
};

const ExpenseTypesTable = ({
    data,
    onClickEdit,
    onClickDelete
}) => {

    let navigate = useNavigate(); 

    const [sortColumn, setSortColumn] = React.useState("expenseTypeId");
    const [sortAsc, setSortAsc] = React.useState(true);

    const sortedData = React.useMemo(() => {
        return data.slice().sort((a, b) => {
          const left = sortAsc ? a : b;
          const right = sortAsc ? b : a;
          const leftValue = String(left[sortColumn]);
          const rightValue = String(right[sortColumn]);
    
          return leftValue.localeCompare(rightValue, "en", {
            numeric: true,
            sensitivity: "base",
          });
        });
    }, [sortColumn, sortAsc, data]);

    function handleSort(id) {
        if (id === sortColumn) {
          setSortAsc((asc) => !asc);
        } else {
          setSortColumn(id);
          setSortAsc(true);
        }
    };

    const routeChange = (item) =>{ 
        let path = `${EXPENSE_TYPES_MANAGER_PATH}/${item?.expenseTypeId}`; 
        navigate(path);
    }

    const expenseTypeActions = (item) => {
        return (
            <FlexGrid flexGridColumnCount={2}>
                <FlexGridItem {...itemOverrides}>
                    <Button 
                        size={SIZE.mini} onClick={() => onClickEdit(item)}
                        startEnhancer={<FontAwesomeIcon icon={faPen} />}
                    >
                        Edit
                    </Button>
                    <Button 
                        size={SIZE.mini} onClick={() => onClickDelete(item)}
                        startEnhancer={<FontAwesomeIcon icon={faTrash} />}
                    >
                        Delete
                    </Button>
                    <Button 
                        size={SIZE.mini} onClick={() => routeChange(item)}
                        startEnhancer={<FontAwesomeIcon icon={faEye} />}
                    >
                        View Details
                    </Button>
                </FlexGridItem>
            </FlexGrid>
        )
    };
    
    return (
        <TableBuilder
            data={sortedData}
            sortColumn={sortColumn}
            sortOrder={sortAsc ? "ASC" : "DESC"}
            onSort={handleSort}
            overrides={overrides}
        >
            <TableBuilderColumn id="name" header="Name" sortable>
                {(row) => row["name"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="category" header="Category" sortable>
                {(row) => row["category"].toUpperCase()}
            </TableBuilderColumn>
            <TableBuilderColumn id="recurrent" header="Recurrent" sortable>
                {(row) => row["recurrent"] === true ? "Yes" : "No"}
            </TableBuilderColumn>
            <TableBuilderColumn id="baseValue" header="Base Value" sortable>
                {(row) => row["baseValue"] ? `R$ ${row["baseValue"].toFixed(2)}` : "-"}
            </TableBuilderColumn>
            <TableBuilderColumn id="actions" header="Actions">
                {(row) => expenseTypeActions(row)}
            </TableBuilderColumn>
        </TableBuilder>
    );
};

export default ExpenseTypesTable;