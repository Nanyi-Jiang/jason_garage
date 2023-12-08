import React from "react";
import { SQLTable } from "~/components/SQLTable";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Box, Button, Divider } from "@chakra-ui/react";

const columnsToDisplay = [
  "id",
  "userId",
  "make",
  "model",
  "year",
  "vin",
  "mileage",
  "createdAt",
];

const Index = () => {
  const { data: sessionData } = useSession();
  const { data: userRole, isLoading: loadingUserData } =
    api.user.getRole.useQuery(
      { userId: sessionData?.user.id ?? "1" },
      { enabled: !!sessionData?.user?.id },
    );

  return sessionData ? (
    <div>
      <ReportPage />
    </div>
  ) : (
    <div>Sign in to view this page</div>
  );
};

interface NumberRange {
  left: number;
  right: number;
}

enum ReportAttribute {
  Year = "Year",
  Mileage = "Mileage",
}

// sort type
enum SortType {
  Ascending = "Ascending",
  Descending = "Descending",
}

const ReportPage = () => {
  const [customRangeOpen, setCustomRangeOpen] = useState<boolean>(false);
  const [numRange, setNumRange] = useState<NumberRange>({
    left: 0,
    right: 999999,
  });
  const [attribute, setAttribute] = useState<ReportAttribute>(
    ReportAttribute.Year,
  );
  const [sortType, setSortType] = useState<SortType>(SortType.Ascending);

  const handleYearAttrPresetPressed = (left: number, right: number) => {
    setNumRange({ left, right });
    setAttribute(ReportAttribute.Year);
  };

  const handleMileageAttrPresetPressed = (left: number, right: number) => {
    setNumRange({ left, right });
    setAttribute(ReportAttribute.Mileage);
  };

  return (
    <div className="flex flex-col">
      {/* Head to show which table this page is */}
      <h1 className=" py-2 font-bold">Report Warehouse</h1>
      {/* drop down to show attributes the report will be on */}
      <Divider />
      <Box className="my-4">
        <h2 className="font-bold">Control Plane</h2>
        <Box className="my-2">
          <Box>
            <text>Report on Attribute: </text>
            <Box className="my-2">
              <select
                className="h-10 rounded-lg"
                onChange={(e) => {
                  setAttribute(e.target.value as ReportAttribute);
                  setNumRange({ left: 0, right: 999999 });
                }}
              >
                <option value={ReportAttribute.Year}>Year</option>
                <option value={ReportAttribute.Mileage}>Mileage</option>
              </select>
            </Box>
          </Box>
          <Box>
            <text>Default options for Attribute: {attribute}</text>
            <Box className="my-2">
              {attribute === ReportAttribute.Year && (
                <DefaultOptionsSelector
                  defaultOptions={[
                    { left: 2000, right: 2010 },
                    { left: 2010, right: 2020 },
                  ]}
                  handlePresetPressed={handleYearAttrPresetPressed}
                />
              )}
              {attribute === ReportAttribute.Mileage && (
                <DefaultOptionsSelector
                  defaultOptions={[
                    { left: 0, right: 10000 },
                    { left: 10000, right: 100000 },
                  ]}
                  handlePresetPressed={handleMileageAttrPresetPressed}
                />
              )}
            </Box>
          </Box>
          <Box>
            <text>Custom Range for Attribute: {attribute}</text>
            <Box className="my-2">
              <Box>
                <Button onClick={() => setCustomRangeOpen(!customRangeOpen)}>
                  {customRangeOpen ? "Close Panel" : "Open Panel"}
                </Button>
              </Box>
              {customRangeOpen && (
                <div className="mt-4">
                  Lower Bound:
                  <input
                    className="mx-2 h-10 rounded-lg"
                    type="number"
                    placeholder={numRange.left.toString()}
                    onChange={(e) =>
                      setNumRange({
                        left: Number(e.target.value),
                        right: numRange.right,
                      })
                    }
                  />
                  Upper Bound:
                  <input
                    className="mx-2 h-10 rounded-lg"
                    type="number"
                    placeholder={numRange.right.toString()}
                    onChange={(e) =>
                      setNumRange({
                        left: numRange.left,
                        right: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </Box>
          </Box>
          <Box>
            <text>Sort Type for Attribute: {attribute}</text>
            <Box className="my-2">
              <select
                className="h-10 rounded-lg"
                onChange={(e) => setSortType(e.target.value as SortType)}
              >
                <option value={SortType.Ascending}>Ascending</option>
                <option value={SortType.Descending}>Descending</option>
              </select>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box className="my-4">
        <h2 className="font-bold">Data Plane</h2>
        {/* Display the report */}
        <ReportDisplay
          numRange={numRange}
          attribute={attribute}
          sortType={sortType}
        />
      </Box>
      <Divider />
      <Box className="my-4">
        <h2 className="font-bold">SQL Info Section</h2>
        <text>
          This section will display all stored procedures and functions in the
          database to gain insight into the database.
        </text>
        <StoredProcedureAndFunctionDisplay />
      </Box>
    </div>
  );
};

const DefaultOptionsSelector = (props: {
  defaultOptions: { left: number; right: number }[];
  handlePresetPressed: (left: number, right: number) => void;
}) => {
  const { defaultOptions, handlePresetPressed } = props;
  return (
    <div>
      {defaultOptions.map((option, index) => (
        <Button
          key={index}
          onClick={() => handlePresetPressed(option.left, option.right)}
          className="mr-4"
        >
          {option.left}-{option.right}
        </Button>
      ))}
    </div>
  );
};

const ReportDisplay = (props: {
  numRange: NumberRange;
  attribute: ReportAttribute;
  sortType: SortType;
}) => {
  const { numRange, attribute, sortType } = props;
  const [rows, setRows] = useState<any[]>([]);

  const { data: carsYr } = api.car.getCarsReportByYear.useQuery(
    {
      yearLeft: numRange.left,
      yearRight: numRange.right,
    },
    {
      enabled: attribute === ReportAttribute.Year,
    },
  ) as any;

  const { data: carsMil } = api.car.getCarsReportByMileage.useQuery(
    {
      mileageLeft: numRange.left,
      mileageRight: numRange.right,
    },
    {
      enabled: attribute === ReportAttribute.Mileage,
    },
  ) as any;

  useEffect(() => {
    if (attribute === ReportAttribute.Year && carsYr) {
      // need to place rows into an array
      const rows = [];
      for (const car of carsYr) {
        rows.push(car);
      }
      rows.sort((a, b) => {
        if (sortType === SortType.Ascending) {
          return a.year - b.year;
        } else {
          return b.year - a.year;
        }
      });
      setRows(rows);
    }
    if (attribute === ReportAttribute.Mileage && carsMil) {
      // need to place rows into an array
      const rows = [];
      for (const car of carsMil) {
        rows.push(car);
      }
      rows.sort((a, b) => {
        if (sortType === SortType.Ascending) {
          return a.mileage - b.mileage;
        } else {
          return b.mileage - a.mileage;
        }
      });
      setRows(rows);
    }
  }, [carsYr, carsMil, attribute, sortType]);

  return (
    <div className="mt-4">
      <text>
        Displaying Car records on Attrribute: {attribute} between{" "}
        {numRange.left} (inclusive) and {numRange.right}
      </text>
      <SQLTable data={rows} columns={columnsToDisplay} table="car" />
    </div>
  );
};

const StoredProcedureAndFunctionDisplay = () => {
  const { data: storedProcedures } =
    api.storedProcedure.getAll.useQuery() as any;

  return (
    <div className="mt-4">
      {/* Display the stored procedures in the db */}
      <div className="font-bold">Stored Procedures or Stored Functions</div>
      <div className="font-bold">Total: {storedProcedures?.length}</div>
      <br />
      {storedProcedures?.map((sp: any) => (
        <div key={sp.name}>
          <div className="font-bold">Schema: {sp.Schema}</div>
          <div>Function or Procedure name: {sp.Name}</div>
          <div>ResultDataType: {sp.ResultDataType}</div>
          <div>ArgumentDataTypes: {sp.ArgumentDataTypes}</div>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Index;
