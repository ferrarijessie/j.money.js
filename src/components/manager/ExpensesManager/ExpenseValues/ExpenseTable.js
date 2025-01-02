import React from "react";
import { Button, SIZE } from "baseui/button";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';


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

const ExpenseTable = ({
    data,
    onClickEdit,
    onClickDelete
}) => {
    const [sortColumn, setSortColumn] = React.useState("expenseId");
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

    const expenseActions = (item) => {
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
            <TableBuilderColumn id="expenseTypeName" header="Type" sortable>
                {(row) => row["expenseTypeName"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="category" header="Category" sortable>
                {(row) => row["category"].toUpperCase()}
            </TableBuilderColumn>
            <TableBuilderColumn id="month" header="Month" sortable>
                {(row) => row["month"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="year" header="Year" sortable>
                {(row) => row["year"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="paid" header="Paid" sortable>
                {(row) => row["paid"] === true ? "OK" : ""}
            </TableBuilderColumn>
            <TableBuilderColumn id="value" header="Value" numeric sortable>
                {(row) => `R$ ${row["value"].toLocaleString(navigator.language, { minimumFractionDigits: 2 })}`}
            </TableBuilderColumn> 
            <TableBuilderColumn id="actions">
                {(row) => expenseActions(row)}
            </TableBuilderColumn>
        </TableBuilder>
    );
};

export default ExpenseTable;