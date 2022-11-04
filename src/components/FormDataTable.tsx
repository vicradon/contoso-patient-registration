import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

const FormDataTable = ({ data }: any) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>Data from form</TableCaption>
        <Thead>
          <Tr>
            <Th>Field</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            Object.keys(data).map((key: string) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>{data[key]}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default FormDataTable;
