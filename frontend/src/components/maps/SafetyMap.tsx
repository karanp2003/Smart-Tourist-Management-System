import { Box, Paper, Stack, Typography } from '@mui/material';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useMemo } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { MapMarker, SafetyZone } from '../../types';
import { JAIPUR_CENTER, zoneColors } from '../../theme/theme';

// Fix default Leaflet marker icons under Vite bundling
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface SafetyMapProps {
  zones?: SafetyZone[];
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: number | string;
  showLegend?: boolean;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useMemo(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function SafetyMap({
  zones = [],
  markers = [],
  center = JAIPUR_CENTER,
  zoom = 13,
  height = 480,
  showLegend = true,
}: SafetyMapProps) {
  return (
    <Box>
      <Box
        sx={{
          height,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          '& .leaflet-container': { height: '100%', width: '100%', zIndex: 0 },
        }}
      >
        <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} />
          {zones
            .filter((z) => z.isActive !== false)
            .map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.centerLat, zone.centerLng]}
                radius={zone.radiusMeters}
                pathOptions={{
                  color: zoneColors[zone.zoneType] || '#64748B',
                  fillColor: zoneColors[zone.zoneType] || '#64748B',
                  fillOpacity: 0.2,
                  weight: 2,
                }}
              >
                <Popup>
                  <strong>{zone.name}</strong>
                  <br />
                  Type: {zone.zoneType}
                  <br />
                  Radius: {zone.radiusMeters}m
                  {zone.description ? (
                    <>
                      <br />
                      {zone.description}
                    </>
                  ) : null}
                </Popup>
              </Circle>
            ))}
          {markers.map((marker) => (
            <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
              <Popup>
                <strong>{marker.label || marker.type || 'Location'}</strong>
                {marker.status ? (
                  <>
                    <br />
                    Status: {marker.status}
                  </>
                ) : null}
                {marker.zoneType ? (
                  <>
                    <br />
                    Zone: {marker.zoneType}
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      {showLegend && (
        <Paper variant="outlined" sx={{ mt: 1.5, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Zone legend
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {Object.entries(zoneColors).map(([type, color]) => (
              <Stack key={type} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
                <Typography variant="caption">{type.replaceAll('_', ' ')}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
