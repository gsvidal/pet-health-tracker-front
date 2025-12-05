import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../../store/auth.store';

export const ActivityLogs = () => {
  const [data, setData] = useState([]);
  const {accessToken} = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      const url = import.meta.env.VITE_API_URL;
      const options = {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      };
      try {
        const response = await fetch(`${url}/audit-logs`, options);
        const data = await response.json();
        console.log('audit logs: ', data);
        setData(data);
      } catch (error: any) {
        console.log(error.error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <section className="section section--activity-logs">
        <div className="container container--activity-logs">
          <h1>Historial de Actividades</h1>
          <p>Lista:</p>

          <div>
            {data.map((item: any) => (
              <>
                <p>{item.action}</p>
                <p>{item.object_type}</p>
                <p>{item.created_at}</p>
                <hr />
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
