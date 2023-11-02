import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

export const SQLTable = (props: { data: any[]; columns: string[] }) => {
  const { data, columns } = props;
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column, index) => {
              return <Th key={index}>{column}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => {
            return (
              <Tr key={index}>
                {columns.map((column, index) => {
                  const key = column as keyof typeof row;
                  if (typeof row[key] === "object") {
                    return (
                      <Td key={index}>{JSON.stringify(row[key], null, 2)}</Td>
                    );
                  } else {
                    return <Td key={index}>{row[key]}</Td>;
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            {columns.map((column, index) => {
              return <Th key={index}>{column}</Th>;
            })}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
};
