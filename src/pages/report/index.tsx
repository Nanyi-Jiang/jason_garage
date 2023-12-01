import React from "react";
import { SQLTable } from "~/components/SQLTable";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Box, Button } from "@chakra-ui/react";

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

interface YearRange {
  yearLeft: number;
  yearRight: number;
}

const ReportPage = () => {
  const [customRangeOpen, setCustomRangeOpen] = useState<boolean>(false);
  const [yearRange, setYearRange] = useState<YearRange>({
    yearLeft: 2010,
    yearRight: 2020,
  });

  return (
    <div className="flex flex-col">
      {/* Head to show which table this page is */}
      <header className=" py-2 font-bold">Report Warehouse</header>

      <Box>
        <Button
          onClick={() => setYearRange({ yearLeft: 2000, yearRight: 2010 })}
          className="mr-4"
        >
          2000-2010
        </Button>
        <Button
          onClick={() => setYearRange({ yearLeft: 2010, yearRight: 2020 })}
          className="mr-4"
        >
          2010-2020
        </Button>
        {/* custom range */}
        <br />
        <Button
          onClick={() => setCustomRangeOpen(!customRangeOpen)}
          className="mt-4"
        >
          Custom Range
        </Button>
        {customRangeOpen && (
          <div className="mt-4">
            Year Left:
            <input
              className="mx-2 h-10 rounded-lg"
              type="number"
              placeholder={yearRange.yearLeft.toString()}
              onChange={(e) =>
                setYearRange({
                  yearLeft: Number(e.target.value),
                  yearRight: yearRange.yearRight,
                })
              }
            />
            Year Right:
            <input
              className="mx-2 h-10 rounded-lg"
              type="number"
              placeholder={yearRange.yearRight.toString()}
              onChange={(e) =>
                setYearRange({
                  yearLeft: yearRange.yearLeft,
                  yearRight: Number(e.target.value),
                })
              }
            />
          </div>
        )}
        <ReportDisplay yearRange={yearRange} />
      </Box>
    </div>
  );
};

const ReportDisplay = (props: { yearRange: YearRange }) => {
  const { yearRange } = props;
  const [rows, setRows] = useState<any[]>([]);

  const { data: cars } = api.car.getCarsByYearWithUser.useQuery({
    yearLeft: yearRange.yearLeft,
    yearRight: yearRange.yearRight,
  });

  useEffect(() => {
    if (cars) {
      // need to place rows into an array
      const rows = [];
      for (const car of cars) {
        rows.push(car);
      }
      setRows(rows);
    }
  }, [cars]);

  return (
    <div className="mt-4">
      <text>
        Displaying Car records between {yearRange.yearLeft} (inclusive) and{" "}
        {yearRange.yearRight}
      </text>
      <SQLTable data={rows} columns={columnsToDisplay} table="car" />
    </div>
  );
};

export default Index;
